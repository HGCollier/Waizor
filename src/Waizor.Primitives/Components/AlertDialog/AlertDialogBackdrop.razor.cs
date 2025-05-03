using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class AlertDialogBackdrop : ComponentBase
{
    [Parameter]
    public string? Class { get; set; }
}
