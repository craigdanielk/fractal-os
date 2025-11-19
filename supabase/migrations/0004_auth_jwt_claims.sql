-- Add tenant_id to auth.users metadata

alter table auth.users

add column if not exists tenant_id uuid;



-- Add role field

alter table auth.users

add column if not exists role text default 'user';



-- Create tenant lookup function

create or replace function set_jwt_claims()

returns trigger as $$

declare

t_id uuid;

r text;

begin

select tenant_id, role into t_id, r

from auth.users

where id = new.id;



new.raw_app_meta_data = jsonb_set(

coalesce(new.raw_app_meta_data, '{}'::jsonb),

'{tenant_id}',

to_jsonb(t_id)

);



new.raw_app_meta_data = jsonb_set(

coalesce(new.raw_app_meta_data, '{}'::jsonb),

'{role}',

to_jsonb(r)

);



return new;

end;

$$ language plpgsql security definer;



-- Trigger

drop trigger if exists set_jwt_claims_trigger on auth.users;

create trigger set_jwt_claims_trigger

before insert or update on auth.users

for each row execute procedure set_jwt_claims();



-- Reload RLS context function for JWT claims

create or replace function public.get_tenant_id()

returns text

language sql stable

as $$

select current_setting('request.jwt.claims.tenant_id', true);

$$;



create or replace function public.get_user_role()

returns text

language sql stable

as $$

select current_setting('request.jwt.claims.role', true);

$$;

