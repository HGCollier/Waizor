using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class AlertDialogPortal : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required AlertDialog AlertDialog { get; set; }
}
