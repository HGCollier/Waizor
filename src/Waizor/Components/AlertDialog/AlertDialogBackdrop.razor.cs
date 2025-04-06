using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AlertDialogBackdrop : ComponentBase
{
    [Parameter]
    public string? Class { get; set; }
}
