import sys
with open(sys.argv[1], 'r') as fin:
    print(fin.read().replace('\n', '\\\\n').replace('\t', ' '))