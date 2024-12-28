import type { AllEntities, Entity } from 'mage-workflow';

type MicrosoftExcelMap = {
	table:
		| 'append'
		| 'addTable'
		| 'convertToRange'
		| 'deleteTable'
		| 'getColumns'
		| 'getRows'
		| 'lookup';
	workbook: 'addWorksheet' | 'deleteWorkbook' | 'getAll';
	worksheet: 'append' | 'clear' | 'deleteWorksheet' | 'getAll' | 'readRows' | 'update' | 'upsert';
};

export type MicrosoftExcel = AllEntities<MicrosoftExcelMap>;

export type MicrosoftExcelChannel = Entity<MicrosoftExcelMap, 'table'>;
export type MicrosoftExcelMessage = Entity<MicrosoftExcelMap, 'workbook'>;
export type MicrosoftExcelMember = Entity<MicrosoftExcelMap, 'worksheet'>;
