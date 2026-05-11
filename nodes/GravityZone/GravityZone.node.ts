import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { description } from './actions/node.description';
import { router } from './actions/router';

// eslint-disable-next-line @n8n/community-nodes/icon-validation
export class GravityZone implements INodeType {
	description: INodeTypeDescription = description;

	methods = {};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const executionData = await router.call(this, i);

				returnData.push.apply(returnData, executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);

					returnData.push.apply(returnData, errorData);

					continue;
				}

				if (error instanceof NodeApiError) {
					throw new NodeApiError(this.getNode(), error as unknown as JsonObject, {
						itemIndex: i,
					});
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
