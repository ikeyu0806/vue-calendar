# vue-calendar
Vue.js(Nuxt.js)で開発した自作のカレンダーサービスです。

Vercelで公開しています。
https://vue-calendar-plum.vercel.app/

APIインターフェイスにはGraphQL、状態管理ライブラリにはVuexを使用しています。

Golang製のバックエンドを[別リポジトリ](https://github.com/ikeyu0806/calendar-backend)で管理しています。
バックエンドはHerokuで公開しています。
https://whispering-retreat-77389.herokuapp.com/

## image
<img width="1097" alt="スクリーンショット 2020-12-28 13 07 33" src="https://user-images.githubusercontent.com/30525452/103451068-99c48a80-4d02-11eb-8ba1-eb848e6246c6.png">

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

- For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## docker

```
docker-compose up
```

## direnv
```
direnv edit .
export BASE_URL=http://localhost:3002/query
```

3001番ポートからアクセスできます。
- http://localhost:3001/

## Author
Yuki Ikegaya
