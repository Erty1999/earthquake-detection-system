# Configuration
Before running the software, add these variables to the .env file:

```bash
#Ports
PORT=
PORT_SOCKET=

#DataSource info
TYPEORM_CONNECTION=
TYPEORM_HOST=
TYPEORM_USERNAME=
TYPEORM_PASSWORD=
TYPEORM_DATABASE=
TYPEORM_PORT=
TYPEORM_SYNCHRONIZE=
TYPEORM_LOGGING=


#first Admin account
ADMIN_FN=
ADMIN_LN=
ADMIN_BIRTHDAY=
ADMIN_EMAIL=
ADMIN_PWD=

#etl account
ETL_FN=
ETL_LN=
ETL_BIRTHDAY=
ETL_EMAIL=
ETL_PWD=

#passive devices manager account
PDM_FN=
PDM_LN=
PDM_BIRTHDAY=
PDM_EMAIL=
PDM_PWD=

#ETL base URL
ETL_BASE_URL=

#PDM base URL
ETL_BASE_URL=

#API token Telegram
TELEGRAM_TOKEN=
```
<br>

# Local
To start this service locally use the following commands:

```bash
#Install all required packages
yarn install

#Run the server in development mode.
yarn dev
```

