# Menggunakan base image Node.js versi 14 varian alpine
FROM node:14-alpine

# Menentukan direktori kerja utama di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Menginstall seluruh dependency
RUN npm install

# Menyalin seluruh sisa kode sumber aplikasi
COPY . .

# Memberi informasi port 3000
EXPOSE 3000

# Perintah default
CMD [ "npm", "start" ]
