# Build stage
FROM golang:1.25.1-alpine AS builder

WORKDIR /app

# Ottimizza download moduli Go
COPY go.mod go.sum ./
RUN go mod download

# Copia il codice e costruisce il binario statico
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags='-w -s' -o gymbook ./

# Runtime stage
FROM alpine:3.18
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /app/gymbook ./gymbook
EXPOSE 8080
ENTRYPOINT ["/app/gymbook"]
