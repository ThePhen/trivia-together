#! /usr/bin/env bash

tag=v0.0.0

for c in backend-node-ts frontend-client-react frontend-admin-react; do
    (
        cd "$c"
        echo "$c -- thephen/tt-$(basename $PWD):$tag" | lolcat
        docker build -t "thephen/tt-$(basename $PWD):$tag" .
        docker push "thephen/tt-$(basename $PWD):$tag"
    )
done
