install:
	@cd client/ && npm install
	@cd server/ && npm install

client:
	@cd client/ && npm start

server:
	@cd server/ && npm run dev

.PHONY: install client server