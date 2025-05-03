using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class AlertDialogContent : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required AlertDialog AlertDialog { get; set; }

    private ElementReference _elementReference;

    private void OnDeactivate() => AlertDialog.Hide();
}
