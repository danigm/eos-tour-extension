project('tour-extension',
  version: '3.8.0',
  meson_version: '>= 0.40.0'
)

sources = [
  'extension.js',
  'highlight.js',
  'service.js',
  'utils.js',
]
extra_sources = [
  'COPYING',
]

i18n = import('i18n')
subdir('po')

uuid = 'eos-tour@endlessm.com'

ver_arr = meson.project_version().split('.')
if ver_arr[1].to_int().is_even()
  shell_version = '@0@.@1@'.format(ver_arr[0], ver_arr[1])
else
  shell_version = '.'.join(ver_arr)
endif

datadir = get_option('datadir')
extensiondir = join_paths(datadir, 'gnome-shell', 'extensions')

metaconf = configuration_data()
metaconf.set('uuid', uuid)
metaconf.set('shell_version', shell_version)

meta = [
  configure_file(
    input: 'metadata.json.in',
    output: 'metadata.json',
    configuration: metaconf
  )
]

install_data(sources + extra_sources + meta,
  install_dir: join_paths(extensiondir, uuid)
)
install_subdir('data', install_dir: join_paths(extensiondir, uuid))

sassc = find_program('sassc', required: true)
sassc_opts = [ '-a', '-M', '-t', 'compact' ]
styles = custom_target('styles',
                       input: 'stylesheet.scss',
                       output: 'stylesheet.css',
                       command: [
                         sassc, sassc_opts, '@INPUT@', '@OUTPUT@',
                       ],
                       depend_files: 'stylesheet.scss',
                       install: true,
                       install_dir: join_paths(extensiondir, uuid),
                       build_by_default: true)

extension_tool = find_program('gnome-extensions', required: false)
if extension_tool.found()
  builddir = meson.current_build_dir()
  srcdir = meson.current_source_dir()

  command = [
    extension_tool,
    'pack',
    '--force',
    '--out-dir=@0@'.format(builddir),
    '--extra-source=@0@/metadata.json'.format(builddir)
  ]

  foreach s : extra_sources
    command += '--extra-source=@0@'.format(s)
  endforeach

  command += srcdir

  run_target('zip-file', command: command)
endif
