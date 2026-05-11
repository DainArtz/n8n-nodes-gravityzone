import { ApplicationError, IDataObject, IDisplayOptions, INodeExecutionData, INodeProperties, jsonParse } from "n8n-workflow";
import merge from 'lodash/merge';

export function updateDisplayOptions(
	displayOptions: IDisplayOptions,
	properties: INodeProperties[],
) {
	return properties.map((nodeProperty) => {
		return {
			...nodeProperty,
			displayOptions: merge({}, nodeProperty.displayOptions, displayOptions),
		};
	});
}

export function processJsonInput<T>(jsonData: T, inputName?: string) {
	let values;
    
	const input = inputName ? `'${inputName}' ` : '';

	if (typeof jsonData === 'string') {
		try {
			values = jsonParse(jsonData);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			// eslint-disable-next-line @n8n/community-nodes/require-node-api-error
			throw new ApplicationError(`Input ${input} must contain a valid JSON`, { level: 'warning' });
		}
	} else if (typeof jsonData === 'object') {
		values = jsonData;
	} else {
		throw new ApplicationError(`Input ${input} must contain a valid JSON`, { level: 'warning' });
	}

	return values;
}

export function wrapData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	if (!Array.isArray(data)) {
		return [{ json: data }];
	}

	return data.map((item) => ({
		json: item,
	}));
}