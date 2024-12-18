echo "Checking files duplicate"
list=$(find ./src/ -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' ! -empty -type f  | sort | sed 's/\.[[:alpha:]]*$//' | uniq -c | grep '2 ')

if [ -z "$list" ]
then
  echo 'All good !'
else
  echo 'Error those files are duplicated'
  echo $list
  exit 128
fi
