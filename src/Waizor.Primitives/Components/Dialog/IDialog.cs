namespace Waizor.Primitives.Components;

public interface IDialog
{
    string TitleId { get; set; }
    string DescriptionId { get; set; }
    bool Open { get; }

    void Show();
    void Hide();
}
