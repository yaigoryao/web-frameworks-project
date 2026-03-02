import sys
with open(sys.argv[1], 'r') as fin:
    print(fin.read().replace('\n', ' ').replace('\t', ' ').replace(' ', ''))