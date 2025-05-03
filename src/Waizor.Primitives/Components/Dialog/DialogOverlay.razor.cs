using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class DialogOverlay : ComponentBase
{
    [Parameter]
    public string? Class { get; set; }
}
