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

devdown: 
	docker-compose down

# create-superadmin-ts:
# 	docker-compose exec backend sh -c "npx ts-node src/scripts/createSuperAdminAndGym.ts"

create-superadmin-js:
	docker-compose exec backend sh -c "node dist/scripts/createSuperAdminAndGym.js"

prodrender:
	docker-compose -f docker-compose.prod.yaml up --build


create-superadmin-ts:
	@if [ "$(gymName)" = "" ] || [ "$(adminName)" = "" ] || [ "$(adminEmail)" = "" ] || [ "$(adminPassword)" = "" ]; then \
		echo "❌ Please provide all the required details: gymName, adminName, adminEmail, adminPassword"; \
		echo "Usage: make create-superadmin-ts gymName='Gym Name' adminName='Admin Name' adminEmail='admin@example.com' adminPassword='password'"; \
		exit 1; \
	else \
		echo "🚀 Creating SuperAdmin and Gym with name: $(gymName), admin: $(adminName)"; \
		docker-compose exec backend sh -c "npx ts-node src/scripts/createSuperAdminAndGym.ts '$(gymName)' '$(adminName)' '$(adminEmail)' '$(adminPassword)'"; \
	fi

# Example ==>>>> make create-superadmin-ts gymName="Golds Gym" adminName="Mohak Tripathi" adminEmail="mohaktripathi@mygoldsgym.com" adminPassword="supersecurepassword"
