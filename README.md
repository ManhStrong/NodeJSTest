<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Hướng dẫn cài đặt

## Chuẩn bị:

- Docker & Docker-compose
- Git
- node v16 trở lên

### Bước 1: Clone project

### Bước 2: Copy file `.env.local` thành 1 file mới tên là `.env`

### Bước 3: Chạy câu lênh `docker-compose up`

### Bước 4: Mở trình duyệt, vào http://localhost:3000/ để kiểm tra xem server đã hoạt động chưa

# Kết nối Database:

Sử dụng mysql workbench hoặc dbeaver (recommend) để kết nối đến DB.

Thông tin kết nối:

- Host: localhost
- Port: 3306
- Database: nestjs
- Username: ml-intern
- Password: password

# Cài đặt node packages:

Khi cài đặt như trên thì trong folder của project chưa có `node_modules` nên khi mở source sẽ thấy lỗi thiếu package, dùng câu lệnh:

```
npm install
```

Để cài đặt

# Sử dụng typeorm CLI:

Mọi câu lệnh sẽ phải thực hiện trong container của docker, chứ không được thực hiện trực tiếp, để vào trong container, dùng câu lệnh:

```
docker-compose exec web sh
```

Khi muốn gọi command của typeorm dung câu lênh:

```
npm run typeorm -- <câu lệnh cần thực hiện>
```

Ví dụ như: `npm run typeorm -- migration:run`

> Trong một số trường hợp thì sẽ không cần `--` nhưng thôi cứ cho vào cho chắc
