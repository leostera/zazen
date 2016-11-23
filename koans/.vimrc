function! Test()
  call VimuxRunCommand("clear; ./node_modules/.bin/babel-tape-runner ".(@%)." | ./node_modules/.bin/colortape")
endfunction

autocmd! BufWritePost *.js :call Test()
