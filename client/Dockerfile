FROM python:3
WORKDIR /app
COPY . ./
RUN apt-get update
RUN apt-get install -y netcat
RUN pip install -r requirements.txt
CMD ["./start.sh"]
