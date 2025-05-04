using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Enums;

namespace Waizor.Primitives.Components;

public partial class Accordion : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public AccordionType Type { get; set; } = AccordionType.Single;

    [Parameter]
    public string? DefaultValue { get; set; }

    [Parameter]
    public List<string> Value { get; set; } = [];

    [Parameter]
    public EventCallback<List<string>> ValueChanged { get; set; }

    [Parameter]
    public bool Collapsible { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    private ElementReference elementReference;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        if (DefaultValue is null)
        {
            return;
        }

        Value = [DefaultValue];
        await ValueChanged.InvokeAsync(Value);
        await InvokeAsync(StateHasChanged);
    }

    public async Task ToggleAsync(string value)
    {
        if (!Collapsible && Value.Count == 1 && Value.Contains(value))
        {
            return;
        }

        if (Value.Contains(value))
        {
            _ = Value.Remove(value);
            await ValueChanged.InvokeAsync(Value);
            await InvokeAsync(StateHasChanged);
            return;
        }

        if (Type == AccordionType.Single)
        {
            Value.Clear();
            await ValueChanged.InvokeAsync(Value);
            await InvokeAsync(StateHasChanged);
        }

        Value.Add(value);
        await ValueChanged.InvokeAsync(Value);
        await InvokeAsync(StateHasChanged);
    }
}
