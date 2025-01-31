import type { MatchResultItem } from '../../logic/search';

export function SuggestionContent(props: {
  suggestion: MatchResultItem;
  query: string;
  isCurrent: boolean;
}) {
  const { suggestion, query } = props;
  const renderHeaderMatch = () => {
    if (suggestion.type === 'header') {
      const { header, headerHighlightIndex } = suggestion;
      const headerPrefix = header.slice(0, headerHighlightIndex);
      const headerSuffix = header.slice(headerHighlightIndex + query.length);
      return (
        <div font="medium">
          <span>{headerPrefix}</span>
          <span bg="brand-light" p="y-0.4 x-0.8" rounded="md" text="text-1">
            {query}
          </span>
          <span>{headerSuffix}</span>
        </div>
      );
    } else {
      return <div font="medium">{suggestion.header}</div>;
    }
  };
  const renderStatementMatch = () => {
    if (suggestion.type !== 'content') {
      return;
    }
    const { statementHighlightIndex, statement } = suggestion;
    const statementPrefix = statement.slice(0, statementHighlightIndex);
    const statementSuffix = statement.slice(
      statementHighlightIndex + query.length
    );
    return (
      <div font="normal" text="sm gray-light" w="100%">
        <span>{statementPrefix}</span>
        <span bg="brand-light" p="y-0.4 x-0.8" rounded="md" text="[#000]">
          {query}
        </span>
        <span>{statementSuffix}</span>
      </div>
    );
  };
  return (
    <div
      border-b-1=""
      border-t-1=""
      table-cell=""
      p="x-3 y-2"
      hover="bg-[#f3f4f5] "
      text="#2c3e50"
      className={`border-right-none border-[#eaecef] ${
        props.isCurrent ? 'bg-[#f3f4f5]' : 'bg-white'
      }`}
      transition="bg duration-200"
    >
      <div font="medium" text="sm">
        {renderHeaderMatch()}
      </div>
      {suggestion.type === 'content' && renderStatementMatch()}
    </div>
  );
}
