CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Theaters (
  theater_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Screens (
  screen_id INT AUTO_INCREMENT PRIMARY KEY,
  theater_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  total_seats INT NOT NULL,
  FOREIGN KEY (theater_id) REFERENCES Theaters(theater_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Movies (
  movie_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  duration_minutes INT,
  language VARCHAR(50),
  genre VARCHAR(80),
  rating VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Shows (
  show_id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  screen_id INT NOT NULL,
  show_time DATETIME NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES Screens(screen_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Seats (
  seat_id INT AUTO_INCREMENT PRIMARY KEY,
  screen_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  row_label VARCHAR(5),
  UNIQUE KEY uniq_screen_seat (screen_id, seat_number),
  FOREIGN KEY (screen_id) REFERENCES Screens(screen_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  show_id INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (show_id) REFERENCES Shows(show_id)
);

CREATE TABLE IF NOT EXISTS Tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  seat_id INT NOT NULL,
  UNIQUE KEY uniq_booking_seat (booking_id, seat_id),
  FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES Seats(seat_id)
);
