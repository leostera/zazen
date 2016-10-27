function! BuildJS()
  call VimuxRunCommand("time make build")
endfunction

function! BuildCTags()
  call VimuxRunCommand("time make tags")
endfunction

autocmd! BufWritePost *.js   :call BuildJS()
autocmd! BufWritePost .ctags* :call BuildCTags()
