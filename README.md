# Krawlee

Price Monitoring Software

---

## Set-up

#### Google Sheets

```sh
cp credentials.json.example credentials.json
```

Enable the [Google Sheets API service](https://console.cloud.google.com/apis/api/sheets.googleapis.com) and [get your credentials](https://console.cloud.google.com/apis/credentials) from Google Cloud Console dashboard and update the `credentials.json` file.

#### Database

```sh
npx prisma migrate
```

Migrate the models to the local database stores.
