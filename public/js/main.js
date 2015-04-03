var a;
$(document).ready(function(){

		/*==============================================
		=            toggle responsive menu            =
		==============================================*/
			$('.header--nav-toggle-link').on('click',function(){
					$('.header--nav').toggleClass('show');
			});
		/*-----  End of toggle responsive menu  ------*/
		
		
		/*==================================
		=            updateSign            =
		==================================*/
			$('.link-updateSign').on('click',function(){
				a = $(this);
				console.log(a);
				var id = $(this).attr('data-id');
				var oldName = $(this).parent().text().trim();
				var newName = prompt('Type new name...',oldName);

				$('<form action="/photo/' + id + '/updateSign" method="POST">' + 
				    '<input type="hidden" name="newName" value="' + newName + '">' +
				    '</form>').submit();
			});
		/*-----  End of updateSign  ------*/


		/*==================================
		=            delete photo           =
		==================================*/
			$('.link-delete').on('click',function(){
				var id = $(this).attr('data-id');
				var yes = confirm('You really want to remove this photo');
				if(yes){

					$('<form action="/photo/' + id + '/delete" method="GET"></form>').submit();
				}
			});
		/*-----  End of delete photo  ------*/



});



