yarn run build &&
(rsync -az --delete ./dist root@m130.ru:/root/projects/builds/bookstore;
# rsync -az --delete node_modules root@m130.ru:/root/projects/builds/bookstore;
rsync yarn.lock root@m130.ru:/root/projects/builds/bookstore;
rsync package.json root@m130.ru:/root/projects/builds/bookstore;)