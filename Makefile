install:
	@cd client/ && npm install
	@cd server/ && npm install

client:
	@cd client/ && npm start

server:
	@cd server/ && npm run dev
	
test:
	@cd server/ && npm run test

.PHONY: install client server
