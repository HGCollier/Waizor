using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuRadioGroup<T> : ComponentBase
{
    [Parameter, EditorRequired]
    public required RenderFragment ChildContent { get; set; }

    [Parameter, EditorRequired]
    public required T Value { get; set; }

    [Parameter]
    public EventCallback<T> ValueChanged { get; set; }

    public async Task SetValueAsync(T value)
    {
        Value = value;
        await ValueChanged.InvokeAsync(Value);
    }
}
