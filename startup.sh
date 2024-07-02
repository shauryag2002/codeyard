echo "Waiting for DB to be ready..."
while ! nc -z db 5432; do   
  sleep 0.1
done
echo "DB is ready."
echo "Running Prisma migrations..."
npm install --global pm2
npx prisma migrate deploy
npx prisma generate
npm run build
echo "Starting Next.js app..."
# npm start
pm2 start npm --name "CodeYard" -- start
pm2 logs CodeYard