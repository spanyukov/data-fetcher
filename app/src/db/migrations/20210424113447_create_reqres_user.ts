import * as Knex from 'knex';

export const up = async (knex: Knex): Promise<any> => {
  return knex.schema
    .raw(`
        CREATE TABLE public.reqres_users
        (
            id         int     NULL,
            email      varchar NULL,
            first_name varchar NULL,
            last_name  varchar NULL,
            avatar     varchar NULL,
            CONSTRAINT reqres_users_pk PRIMARY KEY (id)
        );
    `);
};

export const down = async (): Promise<any> => {
  return false;
};
