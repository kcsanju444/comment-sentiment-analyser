## In command line (with administrator)

- mysql -u root -p [Enter your mysql password]

You can change the following to your own username and password. Just make sure you adjust that in the following lines. And make sure you change the value for it in "app.py".
[app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://{your_chosen_user_name}:{your_chosen_password}@localhost/
comment-analyser'] 

- CREATE USER 'user'@'localhost' IDENTIFIED BY '12345';
- GRANT ALL PRIVILEGES ON `comment-analyser`.* TO 'user'@'localhost';
- FLUSH PRIVILEGES;
- USE `comment-analyser`;
- CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(255) UNIQUE,
    user_password VARCHAR(255)
  );
