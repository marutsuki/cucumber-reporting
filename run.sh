
OUTDIR='./out'
PROJDIR=''
THEME=''
if [ "$1" != "" ]; then
    if [ "$2" != "" ]; then
        OUTDIR=$2
    fi
    if [ "$3" != "" ]; then
        PROJDIR=$3
    fi
    if [ "$4" != "" ]; then
        THEME=$4
    fi
    node_modules/.bin/tailwindcss -i ./src/ui/globals.css -o $OUTDIR/globals.css
    cp ./script.js $OUTDIR/script.js
    node dist/index.js $1 $OUTDIR $PROJDIR $THEME
fi

