-- Add client_id FK to booking_passengers to link passengers with their client records
ALTER TABLE booking_passengers ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

CREATE INDEX idx_booking_passengers_client_id ON booking_passengers(client_id);
