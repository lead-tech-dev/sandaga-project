FROM postgres:15.5

RUN apt-get update && apt-get  install -y postgresql-15-postgis-3
COPY scripts/db.sql /docker-entrypoint-initdb.d/
CMD ["/usr/local/bin/docker-entrypoint.sh","postgres"]