# Makefile

#Example to run the migration
#make migrate name=added-various-table-in-a-go

# Run migration with a dynamic name inside the backend Docker container
migrate:
	@if [ -z "$(name)" ]; then \
		echo "❌ Please provide a migration name using: make migrate name=your_migration_name"; \
		exit 1; \
	fi; \
	echo "🚀 Running Prisma migration with name: $(name)"; \
	docker-compose exec backend sh -c "npx prisma generate && npx prisma migrate dev --name $(name)"

#Example to generate the prisma client and be in sync with db. 
generate:
	docker-compose exec backend sh -c "npx prisma generate"

# Run Prisma Studio inside the backend Docker container
studio:
	docker-compose exec backend sh -c "npx prisma studio"


