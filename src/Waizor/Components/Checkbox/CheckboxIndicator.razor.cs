using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class CheckboxIndicator<T> : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required Checkbox<T?> Checkbox { get; set; }

    [Parameter]
    public string? Class { get; set; }
}
