import type { AllEntities, Entity } from 'mage-workflow';

type PostgresMap = {
	database: 'deleteTable' | 'executeQuery' | 'insert' | 'select' | 'update' | 'upsert';
};

export type PostgresType = AllEntities<PostgresMap>;

export type PostgresDatabaseType = Entity<PostgresMap, 'database'>;
