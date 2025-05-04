# Makefile

#Example to run the migration
#make migrate name=added-various-table-in-a-go

# Run migration with a dynamic name inside the backend Docker container

migrate:
	@if [ "$(name)" = "" ]; then \
		echo "❌ Please provide a migration name using: make migrate name=your_migration_name"; \
		exit 1; \
	else \
		echo "🚀 Running Prisma migration with name: $(name)"; \
		docker-compose exec backend sh -c "npx prisma generate && npx prisma migrate dev --name $(name)"; \
	fi


#Example to generate the prisma client and be in sync with db. 
generate:
	docker-compose exec backend sh -c "npx prisma generate"

# Run Prisma Studio inside the backend Docker container
studio:
	docker-compose exec backend sh -c "npx prisma studio"


# Push schema to DB (optional: use for quick syncing in dev if skipping migrations)
dbpush:
	docker-compose exec backend sh -c "npx prisma db push"

devbuild:
	docker-compose up --build

dev: 
	docker-compose up 

create-superadmin-ts:
	docker-compose exec backend sh -c "npx ts-node src/scripts/createSuperAdminAndGym.ts"

create-superadmin-js:
	docker-compose exec backend sh -c "node dist/scripts/createSuperAdminAndGym.js"

prodrender:
	docker-compose -f docker-compose.prod.yaml up --build


