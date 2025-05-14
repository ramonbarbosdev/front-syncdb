import Swal from 'sweetalert2';

export function exibirErro(textoPadrao: string, e: any): void
{
  console.log(e, textoPadrao);
  let titulo = '';
  let texto = '';

  if(e)
  {
    if (e.error)
      titulo = e.error.code ? e.error.code : '';
      texto = e.error.error;
      if(e.error.detalhes)
      {
        titulo = textoPadrao;
        texto = e.error.detalhes;
      }

  }
  else
  {
      texto = textoPadrao;
  }

  Swal.fire({
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'OK',
  });
}
