#!/usr/bin/env bash


while read t
do
	echo "* [$t](https://smartcontracts.org/docs/base-libraries/${t}.html)"
done < base-library.txt

