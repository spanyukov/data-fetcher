import * as Knex from 'knex';

export const up = async (knex: Knex): Promise<any> => {
  return knex.schema
    .raw(`
        CREATE TABLE public.afflu_dates
        (
            id     serial NOT NULL,
            "date" date   NOT NULL,
            commission float4 NULL,
            sales float4 NULL,
            leads int8 NULL,
            clicks int8 NULL,
            epc float4 NULL,
            impressions int8 NULL,
            cr float4 NULL,
            updated_at timestamptz(0) NULL,
            CONSTRAINT afflu_dates_pk PRIMARY KEY (id),
            CONSTRAINT afflu_dates_un UNIQUE ("date")
        );
    `);
};

export const down = async (): Promise<any> => {
  return false;
};
