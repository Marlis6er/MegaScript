import glob

pre = [
    'utils.js'
]

post = [
	'ConfigManager.js',
	'MegaScript.js'
]

joined_file_name = 'MegaScriptBundled.js'

def can_add_file(file):
	return not (file in pre or file in post or file == joined_file_name)

files = [file for file in glob.glob('*.js') if can_add_file(file)]
files.sort(key=lambda key: key.lower())

# read files into a temporary string
result = ''
for file in pre + files + post:
    with open(file, mode='r', encoding='UTF-8') as f:
        result += f.read()
        f.close()
    result += '\n\n'

with open(joined_file_name, mode='+w', encoding='UTF-8') as f:
    f.write(result)
    f.close()

print('Finished file joining')