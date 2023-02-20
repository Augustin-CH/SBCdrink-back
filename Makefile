DC := docker-compose -f ./docker-compose.yml
EXEC := $(DC) exec api
DR := $(DC) run --rm

.DEFAULT_GOAL: help
.PHONY: help
help: ## Affiche cette aide
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## --- Docker 🐳 ---

.PHONY: up
up: ## Démarre les conteneurs
	$(DC) up -d

.PHONY: down
down: ## Stoppe les conteneurs
	$(DC) down

.PHONY: build
build: ## Construit les images des conteneurs
	$(DC) build

## --- Projet 🐘 ---

.PHONY: init
init: ## Initialise le projet
	$(EXEC) npm install

.PHONY: start
start: ## Démarre le serveur de développement
	$(EXEC) npm run develop

.PHONY: stop
stop: ## Arrêter  le serveur de développement
	$(EXEC) symfony server:stop

.PHONY: shell
shell: ## Lance un shell bash
	$(EXEC) bash

## --- Strapy 🧙‍♂️ ---
