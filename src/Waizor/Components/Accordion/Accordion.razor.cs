using Microsoft.AspNetCore.Components;
using Waizor.Enums;

namespace Waizor.Components;

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
    public List<string> Value { get; set; } = [];

    [Parameter]
    public EventCallback<List<string>> ValueChanged { get; set; }

    [Parameter]
    public bool Collapsible { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    public void Toggle(string value)
    {
        if (!Collapsible && Value.Count == 1 && Value.Contains(value))
        {
            return;
        }

        if (Value.Contains(value))
        {
            _ = Value.Remove(value);
            StateHasChanged();
            return;
        }

        if (Type == AccordionType.Single)
        {
            Value.Clear();
        }

        Value.Add(value);
        StateHasChanged();
    }
}
