function! Test()
  call VimuxRunCommand("clear; yarn test")
endfunction

autocmd! BufWritePost *.js :call Test()
