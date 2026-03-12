# Go Project Makefile

.PHONY: all build test lint fmt clean run

# Variables
BINARY_NAME={{PROJECT_NAME}}
MAIN_PATH=./cmd/server
COVERAGE_THRESHOLD=80

# Default target
all: lint test build

# Build the binary
build:
	go build -o bin/$(BINARY_NAME) $(MAIN_PATH)

# Run tests with coverage
test:
	go test -v -race -coverprofile=coverage.out -covermode=atomic ./...
	@go tool cover -func=coverage.out | grep total | awk '{print "Coverage: " $$3}'

# Check coverage threshold
test-coverage:
	go test -v -race -coverprofile=coverage.out -covermode=atomic ./...
	@coverage=$$(go tool cover -func=coverage.out | grep total | awk '{print $$3}' | tr -d '%'); \
	if [ $$(echo "$$coverage < $(COVERAGE_THRESHOLD)" | bc) -eq 1 ]; then \
		echo "Coverage $$coverage% is below threshold $(COVERAGE_THRESHOLD)%"; \
		exit 1; \
	fi
	@echo "Coverage check passed!"

# Run linters
lint:
	golangci-lint run --timeout 5m

# Format code
fmt:
	go fmt ./...
	goimports -w .

# Tidy dependencies
tidy:
	go mod tidy
	go mod verify

# Clean build artifacts
clean:
	rm -rf bin/
	rm -f coverage.out

# Run the application
run:
	go run $(MAIN_PATH)/main.go

# Install development tools
install-tools:
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install golang.org/x/tools/cmd/goimports@latest
	go install github.com/swaggo/swag/cmd/swag@latest

# Generate Swagger docs
swagger:
	swag init -g cmd/server/main.go -o ./docs

# Security scan
security:
	gosec ./...

# Benchmark tests
bench:
	go test -bench=. -benchmem ./...

# Watch for changes and run tests
watch:
	go test -v -race -cover ./...