import Swal from 'sweetalert2';

export function exibirErro(textoPadrao: string, e: any): void
{
  console.log(e, textoPadrao);
  let titulo = 'Alerta - ';
  let texto = textoPadrao;

  if(e)
  {
     titulo = titulo + e.error.code;
     texto = e.error.error;
    if(e.error.detalhes)
    {
      titulo = textoPadrao;
      texto = e.error.detalhes;
    }

  }
  else
  {
      titulo = titulo + 'inesperado';
      texto = textoPadrao;
  }


  Swal.fire({
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'OK',
  });
}
