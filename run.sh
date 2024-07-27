
OUTDIR='./out'

if [ "$1" != "" ]; then
    if [ "$2" != "" ]; then
        OUTDIR=$2
    fi

    node_modules/.bin/tailwindcss -i ./src/ui/globals.css -o $OUTDIR/globals.css
    node dist/index.js $1 $OUTDIR
fi

