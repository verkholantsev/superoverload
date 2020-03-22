compress(`
  var a = 1;
  var b = ${x};
  console.log(a + b);
`);

compress(`
  if (
  true
  )
  {
    console.log('true');
  }
  else
  {
    console.log('nope');
  }
`)
